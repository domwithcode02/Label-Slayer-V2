import { ProductAnalysisData, IngredientAnalysis } from '../types/api';
import { run } from './db';

export function generateMockAnalysis(pHash: string): ProductAnalysisData {
  // Deterministic mock based on pHash for consistent results
  const hashNum = parseInt(pHash.substring(0, 4), 16);
  const rating = 40 + (hashNum % 50); // 40-90 range
  
  // Generate different product types based on hash
  const productTypes = ['Organic Milk', 'Whole Grain Bread', 'Greek Yogurt', 'Almond Butter', 'Protein Bar'];
  const productIndex = hashNum % productTypes.length;
  const baseProduct = productTypes[productIndex] || 'Generic Product';
  
  return {
    name: `${baseProduct} ${pHash.substring(0, 6)}`,
    description: `Analyzed ${baseProduct.toLowerCase()} product with pHash ${pHash}. ${rating >= 70 ? 'High quality ingredients with minimal processing.' : rating >= 50 ? 'Good quality with some processed ingredients.' : 'Highly processed with multiple additives.'}`,
    rating,
    ratingColor: rating >= 70 ? "#4caf50" : rating >= 50 ? "#ff9800" : "#f44336",
    ingredients: generateMockIngredients(rating, productIndex),
    concerns: rating < 60 ? generateMockConcerns(rating) : []
  };
}

function generateMockIngredients(rating: number, productType: number): IngredientAnalysis[] {
  const baseIngredients: IngredientAnalysis[] = [
    {
      name: "Water",
      rating: "neutral",
      description: "Primary ingredient in most food products, provides hydration",
      benefits: ["Hydration", "Solvent for nutrients"],
      concerns: []
    }
  ];

  if (rating >= 70) {
    // High quality product
    baseIngredients.push({
      name: "Organic Oats",
      rating: "good", 
      description: "Whole grain oats rich in fiber and protein",
      benefits: ["Heart Health", "Fiber", "Sustained Energy"],
      concerns: []
    });
    baseIngredients.push({
      name: "Natural Vanilla Extract",
      rating: "good",
      description: "Pure vanilla extract from vanilla beans",
      benefits: ["Natural Flavoring", "Antioxidants"],
      concerns: []
    });
  } else if (rating >= 50) {
    // Medium quality
    baseIngredients.push({
      name: "Enriched Flour",
      rating: "neutral",
      description: "Wheat flour with added vitamins and minerals",
      benefits: ["Fortified Nutrients", "Energy"],
      concerns: ["Processed Grain"]
    });
    baseIngredients.push({
      name: "Natural Flavors",
      rating: "neutral", 
      description: "Flavor compounds derived from natural sources",
      benefits: ["Taste Enhancement"],
      concerns: ["Vague Labeling"]
    });
  } else {
    // Lower quality
    baseIngredients.push({
      name: "High Fructose Corn Syrup",
      rating: "bad",
      description: "Processed sweetener linked to health concerns",
      benefits: ["Sweetness", "Preservation"],
      concerns: ["Blood Sugar Spikes", "Linked to Obesity"]
    });
    baseIngredients.push({
      name: "Artificial Colors",
      rating: "bad",
      description: "Synthetic food coloring agents",
      benefits: ["Visual Appeal"],
      concerns: ["Hyperactivity in Children", "Artificial Additives"]
    });
  }

  return baseIngredients;
}

function generateMockConcerns(rating: number): string[] {
  const concerns = [];
  
  if (rating < 40) {
    concerns.push("High in artificial additives and preservatives");
    concerns.push("Contains multiple processed ingredients");
    concerns.push("High sugar content (>15g per serving)");
  } else if (rating < 60) {
    concerns.push("Contains some processed ingredients");
    concerns.push("Moderate sugar content");
  }
  
  return concerns;
}

export async function createOrFindProduct(
  analysisData: ProductAnalysisData, 
  db: Parameters<typeof run>[0]
): Promise<string> {
  const productId = `prod-${crypto.randomUUID()}`;
  
  try {
    await run(
      db,
      `INSERT OR IGNORE INTO products (id, name, brand, analysis_generated, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        productId,
        analysisData.name,
        null, // Extract from AI if available in future
        true,
        new Date().toISOString(),
        new Date().toISOString()
      ]
    );
    
    return productId;
  } catch (error) {
    console.error('Error creating product:', error);
    throw new Error('Failed to create product record');
  }
}

// Future: Real AI analysis function
export async function parseAIAnalysis(visionResult: string): Promise<ProductAnalysisData> {
  // TODO: Implement OpenAI GPT-4o vision result parsing
  // For now, return enhanced mock
  return generateMockAnalysis(Math.random().toString(36).substring(7));
}
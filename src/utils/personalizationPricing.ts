interface PersonalizationPricing {
  [key: string]: {
    price: number;
    freeInPacks: boolean;
  };
}

export const PERSONALIZATION_PRICES: PersonalizationPricing = {
  'chemises': {
    price: 30,
    freeInPacks: true
  },
  // Add more product groups here as needed
};

export const getPersonalizationPrice = (
  itemGroup: string, 
  personalization: string | undefined,
  fromPack: boolean = false
): number => {
  console.log('Calculating personalization price:', { itemGroup, personalization, fromPack });
  
  // Return 0 if no personalization or it's undefined/empty
  if (!personalization || personalization === '-' || personalization.trim() === '') {
    return 0;
  }

  const config = PERSONALIZATION_PRICES[itemGroup];
  if (!config) return 0;
  
  // If item is from a pack and personalization is free in packs
  if (fromPack && config.freeInPacks) {
    console.log('Personalization is free for pack items');
    return 0;
  }

  console.log(`Applying personalization price for ${itemGroup}:`, config.price);
  return config.price;
};
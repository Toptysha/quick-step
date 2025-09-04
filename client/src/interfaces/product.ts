export interface FloorCharacteristic {
    title: string;
    description: string;
}

export interface FloorSize {
    length?: number;
    width?: number;
    height?: number;
    mSqareOfPack?: number;
    countOfPack?: number;
}

export interface TechnicalData {
    manufacturer?: string;
    collection?: string;
    color?: string;
    chamfersCount?: string;
    chamfersType?: string;
    typeOfConnection?: string;
    compatibilityWithHeating?: string;
    waterResistance?: string;
    wearResistanceClass?: string;
    assurance?: string;
    lookLike?: string;
}

export interface Product {
    cover: string;
    photos?: string[];
    article: string;
    name: string;      // название основное
    title?: string;    // название расширенное для карочки товара
    type: 'laminat' | 'vinyl' | 'accessory';
    priceOfPack?: number;
    priceOfMSqare?: number;
    remains: number;
    description?: string[]
    isVisible: boolean;

    floorCharacteristics?: FloorCharacteristic[];
    floorSize?: FloorSize;
    technicalData?: TechnicalData;
}

export interface Categories {
    srcCover: string;
    name: string;
    type: Product['type']
}
export interface FloorCharacteristic {
    title: string;
    description: string;
}

export interface FloorSize {
    length?: {name?: 'Длина мм'; value: number};
    width?: {name?: 'Ширина мм'; value: number};
    height?: {name?: 'Высота мм'; value: number};
    mSqareOfPack?: {name?: 'м² / упаковка'; value: number};
    countOfPack?: {name?: 'штук / упаковка'; value: number};
}

export interface TechnicalData {
    manufacturer?: {name?: 'Производитель'; value: string};
    collection?: {name?: 'Коллекция'; value: string};
    color?: {name?: 'Цвет'; value: string};
    chamfersCount?: {name?: 'Количество фасок'; value: string};
    chamfersType?: {name?: 'Тип Фаски'; value: string};
    typeOfConnection?: {name?: 'Тип соединения'; value: string};
    compatibilityWithHeating?: {name?: 'Подогрев полов'; value: string};
    waterResistance?: {name?: 'Влагостойкость'; value: string};
    wearResistanceClass?: {name?: 'Класс влагостойкости'; value: string};
    assurance?: {name?: 'Гарантия'; value: string};
    lookLike?: {name?: 'Вид под'; value: string};
}

export interface Product {
    cover: string;
    photos?: string[];
    article: string;
    name: string;
    title?: string;
    type: 'laminat' | 'vinyl' | 'accessory';
    priceOfPack?: number;
    priceOfMSqare: number;
    remains: number;
    description?: string[]

    floorCharacteristics?: FloorCharacteristic[];
    floorSize?: FloorSize;
    technicalData?: TechnicalData;
}

export interface Categories {
    srcCover: string;
    name: string;
    type: Product['type']
}
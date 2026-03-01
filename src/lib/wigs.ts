import wigsData from "../data/wigs.json";

export interface Wig {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  amazonUrl: string;
  description: string;
  color: string;
  style: string;
}

export function getAllWigs(): Wig[] {
  return wigsData as Wig[];
}

export function getWigById(id: string): Wig | undefined {
  return (wigsData as Wig[]).find((wig) => wig.id === id);
}

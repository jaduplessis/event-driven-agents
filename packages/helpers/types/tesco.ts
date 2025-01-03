import { z } from "zod";

const PriceType = z.object({
  price: z.number(),
  unitPrice: z.number(),
  unitOfMeasure: z.string(),
  actual: z.number(),
});

const NodeType = z.object({
  id: z.string(),
  baseProductId: z.string(),
  title: z.string(),
  brandName: z.string(),
  defaultImageUrl: z.string(),
  shelfName: z.string(),
  isForSale: z.boolean(),
  price: PriceType,
});

const CompositeResultType = z.object({
  node: NodeType,
});

const ProductListType = z.object({
  results: z.array(CompositeResultType),
});

const SearchData = z.object({
  search: ProductListType,
});

const QueryItem = z.object({
  data: SearchData,
  status: z.number(),
});

export const TescoQuerySchema = z.array(QueryItem);

export type TescoQueryType = z.infer<typeof TescoQuerySchema>;

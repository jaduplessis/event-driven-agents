import { z } from "zod";

const productSchema = z.object({
  id: z.string(),
  title: z.string(),
  defaultImageUrl: z.string().url(),
  price: z.object({
    actual: z.number(),
    unitPrice: z.number(),
  }),
});

const itemSchema = z.object({
  charges: z.nullable(z.unknown()),
  quantity: z.number(),
  originalQuantity: z.number(),
  cost: z.number(),
  product: productSchema,
});

const chargesSchema = z.object({
  surcharge: z.number(),
  minimum: z.number(),
  depositCharge: z.number(),
});

const basketSchema = z.object({
  orderId: z.string().optional(),
  totalPrice: z.number(),
  guidePrice: z.number(),
  charges: chargesSchema,
  slot: z.nullable(z.unknown()),
  previousSlot: z.nullable(z.unknown()),
  items: z.array(itemSchema),
});

export const updateBasketSchema = z.object({
  data: z.object({
    basket: basketSchema,
  }),
  status: z.number(),
});

export const TescoUpdateBasketSchema = z.array(updateBasketSchema);
export type TescoUpdateBasketType = z.infer<typeof TescoUpdateBasketSchema>;

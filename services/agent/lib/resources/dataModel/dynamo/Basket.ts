import type { InputItem, TransformedItem, ValidItem } from "dynamodb-toolbox";
import {
  Entity,
  GetItemCommand,
  number,
  QueryCommand,
  schema,
  string,
  UpdateItemCommand,
} from "dynamodb-toolbox";
import { AgentTable } from "./Table";

export const basketItemSchema = schema({
  basketDate: string().key(),
  user: string().key(),
  id: string().key(),
  title: string(),
  quantity: number(),
  unitPrice: number(),
});

export const BasketItemEntity = new Entity({
  name: "BasketItem",
  table: AgentTable,
  schema: basketItemSchema,
  computeKey: ({ basketDate, user, id }) => ({
    PK: `BASKET#${basketDate}`,
    SK: `USER#${user}#PRODUCT#${id}`,
  }),
});

export type BasketItemTypeInput = InputItem<typeof BasketItemEntity>;
export type BasketItemTypeValid = ValidItem<typeof BasketItemEntity>;
export type BasketItemTypeTransformed = TransformedItem<
  typeof BasketItemEntity
>;

export const getBasketItem = async ({
  basketDate,
  user,
  id,
}: {
  basketDate: string;
  user: string;
  id: string;
}): Promise<BasketItemTypeInput> => {
  const { Item } = await BasketItemEntity.build(GetItemCommand)
    .key({ basketDate, user, id })
    .send();

  if (!Item) {
    throw new Error("Basket item not found");
  }
  return Item;
};

export const updateBasketItem = async (
  basketItem: BasketItemTypeInput
): Promise<BasketItemTypeInput> => {
  const { Attributes } = await BasketItemEntity.build(UpdateItemCommand)
    .item(basketItem)
    .options({ returnValues: "ALL_NEW" })
    .send();

  if (!Attributes) {
    throw new Error("Basket item not updated");
  }

  return Attributes;
};

export const listAllBasketItems = async ({
  basketDate,
  user,
}: {
  basketDate: string;
  user?: string;
}): Promise<BasketItemTypeInput[]> => {
  const query = {
    partition: `BASKET#${basketDate}`,
    sort: user ? `USER#${user}#PRODUCT#` : undefined,
  };

  const { Items } = await AgentTable.build(QueryCommand)
    .query(query)
    .entities(BasketItemEntity)
    .send();

  if (!Items) {
    throw new Error("Basket items not found");
  }

  return Items.map((item) => ({
    ...item,
    entity: "BasketItem",
  }));
};

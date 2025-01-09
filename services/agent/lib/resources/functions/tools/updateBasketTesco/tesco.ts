import { getEnvVariable } from "@event-driven-agents/helpers";
import { TescoUpdateBasketType } from "@event-driven-agents/helpers/types";
import { updateBasketSchema } from "@event-driven-agents/helpers/types/tesco/update-basket";
import axios from "axios";

export const updateBasket = async (
  id: string,
  quantity: number,
  bearerToken: string
): Promise<string> => {
  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api.tesco.com/shoppingexperience",
    headers: {
      Connection: "keep-alive",
      Origin: "https://www.tesco.com",
      Referer: "https://www.tesco.com/groceries/en-GB/shop/fresh-food/all",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-site",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      accept: "application/json",
      "accept-language": "en-GB",
      authorization: bearerToken,
      "content-type": "application/json",
      "customer-uuid": "cfdf364d-23c9-41fc-9308-ad7e337b4824",
      language: "en-GB",
      region: "UK",
      "sec-ch-ua":
        '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      traceid:
        "0d3f8038-389a-4451-b07a-18688b3595df:de8e060c-506d-4067-a13d-f73a36888515",
      trkid: "0d3f8038-389a-4451-b07a-18688b3595df",
      "x-apikey": getEnvVariable("TESCO_API_KEY"),
    },
    data: JSON.stringify([
      {
        operationName: "UpdateBasket",
        variables: {
          items: [
            {
              id,
              value: quantity,
            },
          ],
        },
        extensions: {
          mfeName: "unknown",
        },
        query:
          "mutation UpdateBasket($items: [BasketLineItemInputType]) {\n  basket(items: $items) {\n    items {\n      __typename\n      id\n      unit\n      weight\n      cost\n      quantity\n      originalQuantity\n      groupBulkBuyLimitReached\n      bulkBuyLimitReached\n      groupBulkBuyQuantity\n      isNewlyAdded\n      originalWeight\n      product {\n        productType\n        id\n        __typename\n      }\n    }\n    __typename\n  }\n}\n",
      },
      {
        operationName: "AnalyticsSellerIds",
        variables: {},
        extensions: {
          mfeName: "mfe-analytics",
        },
        query:
          "query AnalyticsSellerIds {\n  basket {\n    id\n    splitView {\n      id\n      items {\n        id\n        product {\n          id\n          gtin\n          seller {\n            id\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n",
      },
      {
        operationName: "GetBasketDetails",
        variables: {},
        extensions: {
          mfeName: "unknown",
        },
        query:
          "query GetBasketDetails {\n  basket {\n    amendExpiry\n    guidePrice\n    id\n    isInAmend\n    localisation {\n      currency {\n        iso\n        __typename\n      }\n      __typename\n    }\n    shoppingMethod\n    slot {\n      end\n      expiry\n      id\n      reservationExpiry\n      start\n      status\n      __typename\n    }\n    splitView {\n      __typename\n      id\n      items {\n        id\n        product {\n          id\n          __typename\n        }\n        __typename\n      }\n    }\n    __typename\n  }\n}\n",
      },
      {
        operationName: "GetBasket",
        variables: {},
        extensions: {
          mfeName: "mfe-basket",
        },
        query:
          "query GetBasket {\n  basket {\n    id\n    splitView {\n      __typename\n      id\n      guidePrice\n      totalPrice\n      totalItems\n      items {\n        id\n        product {\n          __typename\n          id\n        }\n        __typename\n      }\n      charges {\n        fulfilment\n        minimumValue\n        __typename\n      }\n      discounts {\n        total\n        categories {\n          type\n          value\n          __typename\n        }\n        __typename\n      }\n    }\n    orderId\n    totalPrice\n    guidePrice\n    discounts {\n      total\n      categories {\n        type\n        value\n        __typename\n      }\n      __typename\n    }\n    charges {\n      surcharge\n      minimum\n      depositCharge\n      __typename\n    }\n    slot {\n      ...Slot\n      __typename\n    }\n    previousSlot {\n      ...Slot\n      __typename\n    }\n    items {\n      charges {\n        charges {\n          __typename\n          ... on DepositReturnCharge {\n            amount\n            __typename\n          }\n        }\n        __typename\n      }\n      id\n      quantity\n      originalQuantity\n      cost\n      unit\n      groupBulkBuyLimitReached\n      bulkBuyLimitReached\n      groupBulkBuyQuantity\n      product {\n        id\n        title\n        defaultImageUrl\n        status\n        bulkBuyLimit\n        bulkBuyLimitGroupId\n        groupBulkBuyLimit\n        averageWeight\n        productType\n        tpnb\n        promotions {\n          id\n          promotionType\n          description\n          timesTriggered\n          missed\n          attributes\n          warnings {\n            type\n            __typename\n          }\n          __typename\n        }\n        price {\n          actual\n          unitPrice\n          unitOfMeasure\n          __typename\n        }\n        restrictions {\n          type\n          isViolated\n          message\n          shortMessage\n          __typename\n        }\n        isForSale\n        __typename\n      }\n      weight\n      isNewlyAdded\n      __typename\n    }\n    localisation {\n      currency {\n        iso\n        __typename\n      }\n      __typename\n    }\n    constraints {\n      maxItemCount\n      __typename\n    }\n    issues {\n      exceptions {\n        level\n        reason\n        __typename\n      }\n      __typename\n    }\n    shoppingMethod\n    isAmendBasket: isInAmend\n    __typename\n  }\n}\n\nfragment Slot on SlotType {\n  id\n  start\n  end\n  expiry\n  reservationExpiry\n  charge\n  status\n  group\n  locationId\n  freeDelivery {\n    __typename\n    deliveryThreshold\n    deliveryMessageThreshold\n    qualifiesForFreeDelivery\n  }\n  __typename\n}\n",
      },
    ]),
  };

  try {
    const response = await axios.request(config);

    if (!response.status.toString().startsWith("2")) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.data;
    console.log("Data fetched:", JSON.stringify(data, null, 2));

    const results: TescoUpdateBasketType = [];
    data.forEach((element: any) => {
      const { success, data } = updateBasketSchema.safeParse(element);

      if (success) {
        results.push(data);
      }
    });

    return JSON.stringify(results);
  } catch (error) {
    // console.error("Error fetching data:", error);
    throw error;
  }
};

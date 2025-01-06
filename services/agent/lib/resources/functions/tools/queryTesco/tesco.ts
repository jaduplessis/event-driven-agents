import { getEnvVariable } from "@event-driven-agents/helpers";
import { TescoQuerySchema } from "@event-driven-agents/helpers/types";
import axios from "axios";

export const queryTesco = async (
  query: string,
  page: number = 1
): Promise<string> => {
  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api.tesco.com/shoppingexperience",
    headers: {
      Connection: "keep-alive",
      Origin: "https://www.tesco.com",
      Referer:
        "https://www.tesco.com/groceries/en-GB/search?query=granola&inputType=free+text",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-site",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      accept: "application/json",
      "accept-language": "en-GB",
      "content-type": "application/json",
      language: "en-GB",
      region: "UK",
      "sec-ch-ua":
        '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      traceid:
        "0d3f8038-389a-4451-b07a-18688b3595df:51c56230-7908-449f-b40f-42d5bf2a6ca9",
      trkid: "0d3f8038-389a-4451-b07a-18688b3595df",
      "x-apikey": getEnvVariable("TESCO_API_KEY"),
    },
    data: JSON.stringify([
      {
        operationName: "Search",
        variables: {
          page,
          includeRestrictions: true,
          includeVariations: true,
          query,
          filterCriteria: [
            {
              name: "inputType",
              values: ["free text"],
            },
          ],
          sortBy: "relevance",
        },
        extensions: {
          mfeName: "unknown",
        },
        query:
          "query Search($query: String!, $page: Int = 1, $count: Int, $sortBy: String, $offset: Int, $facet: ID, $favourites: Boolean, $filterCriteria: [filterCriteria], $configs: [ConfigArgType], $includeRestrictions: Boolean = true, $includeVariations: Boolean = true) {\n  search(\n    query: $query\n    page: $page\n    count: $count\n    sortBy: $sortBy\n    offset: $offset\n    facet: $facet\n    favourites: $favourites\n    filterCriteria: $filterCriteria\n    configs: $configs\n  ) {\n    pageInformation: info {\n      ...PageInformation\n      __typename\n    }\n    results {\n      node {\n        ... on MPProduct {\n          ...ProductItem\n          __typename\n        }\n        ... on ProductType {\n          ...ProductItem\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    facetLists: facetGroups {\n      ...FacetLists\n      __typename\n    }\n    popularFilters: popFilters {\n      ...PopFilters\n      __typename\n    }\n    options {\n      sortBy\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment ProductItem on ProductInterface {\n  typename: __typename\n  ... on ProductType {\n    context {\n      type\n      ... on ProductContextOfferType {\n        linkTo\n        offerType\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  ... on MPProduct {\n    context {\n      type\n      ... on ProductContextOfferType {\n        linkTo\n        offerType\n        __typename\n      }\n      __typename\n    }\n    seller {\n      id\n      name\n      __typename\n    }\n    variations {\n      ...Variation @include(if: $includeVariations)\n      __typename\n    }\n    __typename\n  }\n  id\n  tpnb\n  tpnc\n  gtin\n  adId\n  baseProductId\n  title\n  brandName\n  shortDescription\n  defaultImageUrl\n  superDepartmentId\n  quantityInBasket\n  superDepartmentName\n  departmentId\n  departmentName\n  aisleId\n  aisleName\n  shelfId\n  shelfName\n  displayType\n  productType\n  averageWeight\n  bulkBuyLimit\n  maxQuantityAllowed: bulkBuyLimit\n  groupBulkBuyLimit\n  bulkBuyLimitMessage\n  bulkBuyLimitGroupId\n  timeRestrictedDelivery\n  restrictedDelivery\n  isForSale\n  isInFavourites\n  isNew\n  isRestrictedOrderAmendment\n  status\n  maxWeight\n  minWeight\n  increment\n  details {\n    components {\n      ...Competitors\n      ...AdditionalInfo\n      __typename\n    }\n    __typename\n  }\n  catchWeightList {\n    price\n    weight\n    default\n    __typename\n  }\n  price {\n    price: actual\n    unitPrice\n    unitOfMeasure\n    actual\n    __typename\n  }\n  promotions {\n    id\n    promotionType\n    startDate\n    endDate\n    description\n    unitSellingInfo\n    price {\n      beforeDiscount\n      afterDiscount\n      __typename\n    }\n    attributes\n    __typename\n  }\n  restrictions @include(if: $includeRestrictions) {\n    type\n    isViolated\n    message\n    __typename\n  }\n  reviews {\n    stats {\n      noOfReviews\n      overallRating\n      overallRatingRange\n      __typename\n    }\n    __typename\n  }\n  modelMetadata {\n    name\n    version\n    __typename\n  }\n}\n\nfragment Competitors on CompetitorsInfo {\n  competitors {\n    id\n    priceMatch {\n      isMatching\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment AdditionalInfo on AdditionalInfo {\n  isLowEverydayPricing\n  __typename\n}\n\nfragment Variation on VariationsType {\n  products {\n    id\n    baseProductId\n    variationAttributes {\n      attributeGroup\n      attributeGroupData {\n        name\n        value\n        attributes {\n          name\n          value\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment FacetLists on ProductListFacetsType {\n  __typename\n  category\n  categoryId\n  facets {\n    facetId: id\n    facetName: name\n    binCount: count\n    isSelected: selected\n    __typename\n  }\n}\n\nfragment PageInformation on ListInfoType {\n  totalCount: total\n  pageNo: page\n  pageId\n  count\n  pageSize\n  matchType\n  offset\n  query {\n    searchTerm\n    actualTerm\n    __typename\n  }\n  __typename\n}\n\nfragment PopFilters on ProductListFacetsType {\n  category\n  categoryId\n  facets {\n    facetId: id\n    facetName: name\n    binCount: count\n    isSelected: selected\n    __typename\n  }\n  __typename\n}\n",
      },
    ]),
  };

  try {
    const response = await axios.request(config);

    if (!response.status.toString().startsWith("2")) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.data;

    const results = TescoQuerySchema.parse(data);
    return JSON.stringify(results);
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

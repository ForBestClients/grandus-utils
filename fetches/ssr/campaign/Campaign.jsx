import {reqApiHost, reqGetHeaders, getFrontendUrlFromHeaders} from 'grandus-lib/utils';
import get from 'lodash/get';
import {getApiExpand, reqGetHost, } from "@/grandus-utils";
import getCampaigns from "@/grandus-utils/fetches/ssr/campaign/Campaigns";
import {queryToQueryString} from "@/grandus-lib/utils/filter";

const getCampaign = async data => {
    const req = {};
    const query = {};

    const params = get(data, 'params');

    query.expand = params?.expand ? params?.expand : getApiExpand('CAMPAIGN_DETAIL', true)

    const urlCampaign = params?.urlTitle;
    const urlRest = queryToQueryString(query, {}, ["campaign"], {
        encode: true,
    });

    let [campaigns, campaign, products, filter] = await Promise.all([
        getCampaigns(),
        fetch(
            `${reqApiHost(req)}/api/v2/campaigns/${urlCampaign}?expand=coverPhoto`,
            {
                headers: reqGetHeaders(req),
            }
        ).then((result) => result.json()),
        fetch(
            `${reqGetHost(req)}/api/lib/v1/products?marketingCampaign=${urlCampaign}&${urlRest}`
        ).then((result) => result.json()),
        fetch(
            `${reqGetHost(req)}/api/lib/v1/filters?marketingCampaign=${urlCampaign}&${urlRest}`,
            {
                headers: reqGetHeaders(req, {
                    forwardUrl: getFrontendUrlFromHeaders(req?.headers),
                }),
            }
        ).then((result) => result.json()),
    ]);

    return {
        campaigns: get(campaigns, "campaigns", {}),
        campaign: get(campaign, "data", {}),
        products: get(products, "products", []),
        pagination: get(products, "pagination", {}),
        filter: filter,
        meta: get(filter, "meta", {}),
        breadcrumbs: get(filter, "breadcrumbs", {}),
    };

};

export default getCampaign;

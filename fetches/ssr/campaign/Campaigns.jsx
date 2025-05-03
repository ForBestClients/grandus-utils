import { reqApiHost, reqGetHeaders, getPaginationFromHeaders } from 'grandus-lib/utils';
import get from 'lodash/get';
import {getApiExpand} from "@/grandus-utils";

const getCampaigns = async data => {
    const req = {};
    const uri = [];

    const searchParams = get(data, 'searchParams');
    const params = get(data, 'params');

    uri.push(`perPage=${get(searchParams, "perPage", process.env.NEXT_PUBLIC_CAMPAIGNS_DEFAULT_PER_PAGE)}`);

    if (searchParams?.page) {
        uri.push(`page=${get(searchParams, "page", 1)}`);
    }

    if (params?.expand) {
        uri.push(`expand=${params?.expand}`);
    } else {
        uri.push(getApiExpand('CAMPAIGN_CARD', true));
    }

    let pagination = {};
    const campaigns = await fetch(
            `${reqApiHost(req)}/api/v2/campaigns?${uri.join("&")}`,
            {
                headers: reqGetHeaders(req),
                next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
            }
        ).then((result) => {
            pagination = getPaginationFromHeaders(result.headers);
            return result.json()}
        ).then((r) => r.data);

    return {
        campaigns: campaigns,
        pagination: pagination,
    }
};

export default getCampaigns;

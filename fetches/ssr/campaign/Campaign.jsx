import { reqApiHost, reqGetHeaders, getPaginationFromHeaders } from 'grandus-lib/utils';
import get from 'lodash/get';
import {getApiExpand, reqGetHost} from "@/grandus-utils";

const getCampaign = async data => {
    const req = {};
    const uri = [];

    const params = get(data, 'params');

    if (params?.expand) {
        uri.push(`expand=${params?.expand}`);
    } else {
        uri.push(getApiExpand('CAMPAIGN_DETAIL', true));
    }

    return await fetch(
            `${reqGetHost(req)}/api/lib/v1/campaigns/${params?.urlTitle}?${uri.join("&")}`,
            {
                headers: reqGetHeaders(req),
                next: { revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE) },
            }
        )
        .then((result) => result.json());

};

export default getCampaign;

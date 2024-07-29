// export type actionitemArray = [
//     {
//         title: string,
//         picurl: string,
//         videoUrl: string,
//         intro: string,
//     }
// ]

// export type actionrouter = {
//     id?: string;
//     picurl?: string;
//     videoUrl?: string;
//     intro?: string;
//     title: string;
//     isActive?: boolean;
//     children: actionrouter[];
//     orderid?: number | string;
// };


interface ActionItem {
    title: string;
    id: string;
    children: ActionItem[];
    orderid?: number;
    picurl?: string;
    videoUrl?: string;
    intro?: string;
    editorder?: boolean

}

interface actionrouter {
    id: string;
    title: string;
    children: ActionItem[];
    orderid: number;
    editorder?: boolean

}



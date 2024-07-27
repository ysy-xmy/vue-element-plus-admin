export type actionitemArray = [
    {
        title: string,
        picurl: string,
        videoUrl: string,
        intro: string,
    }
]

export type actionrouter = {
    id?: string;
    picurl?: string;
    videoUrl?: string;
    intro?: string;
    title: string;

    children?: actionrouter[];
};



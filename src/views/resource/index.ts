interface OriginalDirectory {
    ID: number;
    Name: string;
    OrderNum: number;
    CreatedAt: string;
}

interface TransformedDirectory {
    title: string;
    id: string;
    children: any[]; // 可以更具体地定义 children 的类型，如果已知
    orderid: number;
}


export const transformDirectoryFormat = (originalDirectories: OriginalDirectory[]) => {
    return originalDirectories.map(directory => {
        return {
            title: directory.Name,
            id: directory.ID.toString(),
            children: [], // 假设每个一级目录下没有子目录
            orderid: directory.OrderNum
        };
    });
};

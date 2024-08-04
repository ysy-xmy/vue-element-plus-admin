type FirstCategory = {
    ID: number;
    Name: string;
    OrderNum: number;
    CreatedAt: string;
    UpdatedAt: string;
};

type SecondCategory = {
    ID: number;
    Name: string;
    FirstCategoryID: number;
    OrderNum: number;
    CreatedAt: string;
    UpdatedAt: string;
};

type FirstCategoryInfo = {
    FirstCategory: FirstCategory;
    SecondCategoryInfos: {
        SecondCategory: SecondCategory;
        ActionInfos: any;
    }[];
};

type TargetFormat = {
    title: string;
    id: number;
    orderid: number;
    children: TargetFormat[];
    isActive: boolean;
};

export function transformToTargetFormat(categoryInfos: FirstCategoryInfo[]): TargetFormat[] {
    const targetFormat: TargetFormat[] = [];

    categoryInfos.forEach(info => {
        const firstCategory: FirstCategory = info.FirstCategory;
        const secondCategoryInfos: { SecondCategory: SecondCategory; ActionInfos: any; }[] | null = info.SecondCategoryInfos;

        // 创建一级目录对象
        const firstCategoryObj: TargetFormat = {
            title: firstCategory.Name,
            id: firstCategory.ID,
            orderid: firstCategory.OrderNum,
            children: [],
            isActive: true
        };

        // 如果存在二级目录，则将其添加到一级目录的 children 中
        if (secondCategoryInfos) {
            firstCategoryObj.children = secondCategoryInfos.map(secondInfo => ({
                title: secondInfo.SecondCategory.Name,
                id: secondInfo.SecondCategory.ID,
                orderid: secondInfo.SecondCategory.OrderNum,
                children: [],
                isActive: true
            }));
        }

        // 将一级目录对象添加到结果数组中
        targetFormat.push(firstCategoryObj);
    });

    return targetFormat;
}



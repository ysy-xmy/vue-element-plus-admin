export function convertDateTime(isoString: string): string {
    const date = new Date(isoString);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${year}年${month}月${day}日${hours}:${minutes}:${seconds}`;
}

// 使用函数
// const isoString = "2024-07-24T13:40:52Z";
// const formattedString = convertDateTime(isoString);
// console.log(formattedString); // 输出: 2024年07月24日 13:40:52

const FormatPrice=({price})=>{
    return Intl.NumberFormat("tr-TR",{
        style:"currency",
        currency:"TRY",
        maximumFractionDigits:2,

    }).format(price/100);
};
export default FormatPrice;
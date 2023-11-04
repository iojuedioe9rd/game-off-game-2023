export default function collision(first: rect, second: rect)
{
    if(
        !(first.x > second.x + second.width || 
            first.x + first.width < second.x ||
            first.y > second.y + second.height || 
            first.y + first.height < second.y)
            

            
    )
    {
        return true
    }
    return false
}

export default function FoodForm() {
    return(
    <form className="food-form">
        <label htmlFor="sushiName">Title your cuisine:</label>
        <input type="text" id="sushiName" name="sushiName" required />
    </form>)
}
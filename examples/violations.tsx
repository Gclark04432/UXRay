export const Form = () => {
    return (
        <>
            <img src="logo.png" />
            <input type='text' placeholder="Enter Name..."/>
            <label htmlFor="email">Email</label>
            <input id='email' type='email'/>
            <button></button>
            <a>Click me</a>
            <select>
                <option>Yes</option>
                <option>No</option>
            </select>
            <textarea/>
            <iframe width={20} height={20} src='https://www.example.org'></iframe>
        </>
    )
}
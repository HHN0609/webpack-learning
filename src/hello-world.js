function getString () {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("hello world !!!")
        }, 2000)
    })
}

export async function helloWorld () {
    let str = await getString()
    console.log(str) 
}
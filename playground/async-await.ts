const doWork = async (): Promise<string> => {
    return 'Przemo';
}

doWork().then((result: string) => {
    console.log(result)
}).catch((e: any) => {
    console.log(e)
})
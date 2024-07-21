const matchUrl = (text: string) =>
{
    const regex: RegExp = /^(https?:\/\/)((([a-zA-Z0-9\-_]+\.)+[a-zA-Z]{2,})|localhost)(:\d{1,5})?(\/[^\s]*)?$/
    return regex.test(text);

};

export { matchUrl };

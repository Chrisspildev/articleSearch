export interface Article {
    id: string
    userId: string
    title: string
    body: string


}

export interface Response<T> {
    data: T
}
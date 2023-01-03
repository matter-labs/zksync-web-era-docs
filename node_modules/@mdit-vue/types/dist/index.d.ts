interface MarkdownItEnv {
}
interface MarkdownItHeader {
    /**
     * The level of the header
     *
     * `1` to `6` for `<h1>` to `<h6>`
     */
    level: number;
    /**
     * The title of the header
     */
    title: string;
    /**
     * The slug of the header
     *
     * Typically the `id` attr of the header anchor
     */
    slug: string;
    /**
     * Link of the header
     *
     * Typically using `#${slug}` as the anchor hash
     */
    link: string;
    /**
     * The children of the header
     */
    children: MarkdownItHeader[];
}

export { MarkdownItEnv, MarkdownItHeader };

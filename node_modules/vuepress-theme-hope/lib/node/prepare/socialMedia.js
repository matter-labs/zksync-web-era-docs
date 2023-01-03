export const prepareSocialMediaIcons = async (app, icons) => {
    await app.writeTemp(`theme-hope/socialMedia.js`, `\
export const icons = ${JSON.stringify(icons)};
`);
};
//# sourceMappingURL=socialMedia.js.map
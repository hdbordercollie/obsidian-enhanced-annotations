export const isValidLabel = (label: string) => {
    return !/[:\s]/.test(label) && label !== '/' && label.length > 0;
};

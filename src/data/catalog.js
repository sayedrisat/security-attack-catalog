const modules = import.meta.glob('./categories/*.json', { eager: true, import: 'default' });

const catalog = Object.values(modules).sort((a, b) => a.order - b.order);

export default catalog;

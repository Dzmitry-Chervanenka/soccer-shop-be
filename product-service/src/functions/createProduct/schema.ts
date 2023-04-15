export const schema = {
    type: 'object',
    properties: {
        title: { type: 'string' },
        price: { type: 'integer' },
        description: { type: 'string' },
    },
    required: ['title', 'price', 'description']
} as const;

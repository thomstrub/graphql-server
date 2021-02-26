const { ApolloServer } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const resolvers = {
    Query: {
        info: () => `This is the API of a Hackernews Clone`,
        feed: () => links,
        link: (root, {id}) => links.find(link => link.id === id)
    },
    Mutation: {
        post: (parent, args) => {
            const link = {
                id: `link-${idCount++}`,
                description: args.description,
                url: args.url,
            }
            links.push(link)
            return link
        },
        updateLink: (parent, args) => {
            let selectedLink = links.find(link => link.id === args.id);
            selectedLink.description = args.description;
            selectedLink.url = args.url;
            return selectedLink;
        },
        deleteLink:(parent, args) => {
            let selectedLink = links.find(link => link.id === args.id);
            links.splice(selectedLink, 1);
            return selectedLink;
        }
    },
}

//3
const prisma = new PrismaClient();
const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphql'),
        'utf8'
    ),
    resolvers,
    context: {
        prisma,
    }
})

server
    .listen()
    .then(({ url }) =>
        console.log(`Server is running on ${url}`)
    );
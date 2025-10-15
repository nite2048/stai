import prisma from './prismaClient.js'

export async function connectDatabase() {
  try {
       await prisma.$connect()
       console.log("Database connected")
  } catch (e) {
       console.error("Connection failed: ", e)
  } finally {
       await prisma.$disconnect()
  }
}

export async function getAllUsers() {
    return prisma.user.findMany();
}

export async function findUserById(userId) {
    return prisma.user.findUnique({ where: { id: userId } });
}

export async function getPrismaUserByGoogleAuth(googleAuthResponse){
     const user = await prisma.user.findUnique({ where: { googleId : googleAuthResponse.id }});
     if(user == null){
          return prisma.user.create({
              data: {
                  googleId: googleAuthResponse.id,
                  email: googleAuthResponse.email,
                  name: googleAuthResponse.name
              }
          });
     }else{
          return user;
     }
     
}

export async function getPrismaUserByGithubAuth(githubAuthResponse){
     const user = await prisma.user.findUnique({ where: { githubId : githubAuthResponse.node_id }});
     if(user == null){
          return prisma.user.create({
              data: {
                  githubId: githubAuthResponse.node_id,
                  email: githubAuthResponse.email,
                  name: githubAuthResponse.name
              }
          });
     }else{
          return user;
     }
}
FROM node:24-bookworm

# Clone Repository
RUN [ "/usr/bin/apt", "install", "-y", "git" ]
RUN [ "/usr/bin/git", "clone" , "https://github.com/yoonjin67/DreamHome", "/DreamHome"]

# Clone Bash Environment
ADD ./env /root/.envs
RUN [ "/bin/bash", "-c", "echo PATH=\"$PATH:/DreamHome/node_modules/.bin\" >> /root/.envs" ]
RUN [ "/bin/bash", "-c" , "source /root/.envs" ]

# Change Work Directory into Source Root
WORKDIR /DreamHome

# Install NPM Dependencies
RUN [ "/bin/bash",  "-c", "npm install" ]

# Run React Scripts
CMD [ "/bin/bash", "-c", "npm run start" ]

# Expose port

EXPOSE 3000/tcp

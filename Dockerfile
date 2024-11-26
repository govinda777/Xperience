FROM node:20

# Instalação de pacotes necessários, incluindo Trivy
RUN apt-get update && apt-get install -y \
    wget apt-transport-https gnupg lsb-release jq \
    && wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | apt-key add - \
    && echo deb https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main | tee /etc/apt/sources.list.d/trivy.list \
    && apt-get update && apt-get install -y trivy \
    && apt-get clean

WORKDIR /app

# Copiando apenas os arquivos de dependências para otimizar o cache
COPY package.json yarn.lock ./

# Instalação das dependências usando --no-cache para garantir que não haja problemas de cache
RUN yarn install --frozen-lockfile --no-cache || { echo "❌ Falha na instalação das dependências"; exit 1; }

# Copiando o restante dos arquivos
COPY . .

# Comando padrão
CMD ["yarn", "lint"]

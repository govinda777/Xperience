#!/bin/sh

# Função para adicionar cores
green='\033[0;32m'
red='\033[0;31m'
yellow='\033[1;33m'
reset='\033[0m'

# Captura o início do tempo de execução
start_time=$(date +%s)

echo "${yellow}🚀 Iniciando o script pipeline.sh${reset}"

# Executa os testes com cobertura
yarn jest --coverage || exit 1

# Verifica se a cobertura mínima de 80% foi atingida
coverage=$(awk '/All files/ {print int($3)}' coverage/lcov-report/index.html)

if [ "$coverage" -lt 80 ]; then
  echo "${red}❌ Cobertura de testes abaixo de 80%! Commit bloqueado.${reset}"
  exit 1
else
  echo "${green}✅ Cobertura de testes está em $coverage%. Commit permitido.${reset}"
fi

# Construindo a imagem Docker com detalhes adicionais
echo "${yellow}🔨 Construindo a imagem Docker...${reset}"
docker build --progress=plain -t twa-govinda-systems-ecomm . || {
  echo "${red}❌ Falha na construção da imagem Docker${reset}"
  exit 1
}

# Executando testes e linting em paralelo para ganhar tempo
echo "${yellow}🧪 Executando testes e linting...${reset}"

# Inicia os processos em segundo plano e captura os PIDs
(
  yarn test && echo "${green}✅ Testes passaram${reset}"
) &
pid_test=$!

(
  yarn lint && echo "${green}✅ Linting passou${reset}"
) &
pid_lint=$!

# Aguardar os dois processos paralelos terminarem e capturar os status de saída
wait $pid_test
status_test=$?

wait $pid_lint
status_lint=$?

if [ $status_test -ne 0 ] || [ $status_lint -ne 0 ]; then
  echo "${red}❌ Falha nos testes ou no linting${reset}"
  exit 1
fi

# Somente rodar o Trivy scan se os testes e linting passarem
echo "${yellow}🔎 Executando Trivy scan...${reset}"

# Verifica se a imagem twa-govinda-systems-ecomm existe
if ! docker images twa-govinda-systems-ecomm:latest | awk 'NR>1 {print $1}' | grep -q '^twa-govinda-systems-ecomm$'; then
  echo "${red}❌ A imagem twa-govinda-systems-ecomm não foi encontrada. Certifique-se de que a imagem foi construída corretamente.${reset}"
  exit 1
fi

# Executa o Trivy scan na imagem
docker run --rm -v "$(pwd)":/app aquasec/trivy image --exit-code 1 --severity HIGH,CRITICAL --no-progress --format json -o trivy-report.json twa-govinda-systems-ecomm || {
  echo "${red}❌ Trivy encontrou vulnerabilidades${reset}"

  # Verifique se o jq está instalado antes de tentar processar o arquivo JSON
  if command -v jq > /dev/null; then
    jq '.' trivy-report.json
  else
    echo "${red}❌ 'jq' não encontrado. Por favor, instale 'jq' para ver os detalhes das vulnerabilidades.${reset}"
    cat trivy-report.json
  fi
  exit 1
}

echo "${green}✅ Nenhuma vulnerabilidade crítica encontrada${reset}"

# Mensagem final amigável
echo "${green}🎉 Parabéns! O Pipeline foi concluído com sucesso!${reset}"
echo "${green}💡 Código testado, analisado e livre de vulnerabilidades críticas. Você está pronto para seguir em frente! 💪${reset}"

# Captura o fim do tempo de execução
end_time=$(date +%s)

# Calcula o tempo total em segundos
total_time=$((end_time - start_time))

# Converte o tempo total para minutos e segundos
minutes=$((total_time / 60))
seconds=$((total_time % 60))

# Exibe o tempo total
echo "${yellow}⏱ Tempo total de execução: ${minutes} minutos e ${seconds} segundos${reset}"

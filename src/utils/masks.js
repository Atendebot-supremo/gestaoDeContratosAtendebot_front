// Utilitários para máscaras de input

export const formatCNPJ = (value) => {
  // Remove tudo que não é dígito
  const numbers = value.replace(/\D/g, '')
  
  // Aplica a máscara XX.XXX.XXX/XXXX-XX
  if (numbers.length <= 2) {
    return numbers
  } else if (numbers.length <= 5) {
    return `${numbers.slice(0, 2)}.${numbers.slice(2)}`
  } else if (numbers.length <= 8) {
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`
  } else if (numbers.length <= 12) {
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`
  } else {
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`
  }
}

export const cleanCNPJ = (value) => {
  return value.replace(/\D/g, '')
}

export const isValidCNPJ = (cnpj) => {
  const clean = cleanCNPJ(cnpj)
  return clean.length === 14
}

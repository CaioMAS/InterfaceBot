'use client';

import React from 'react';
import styles from '../page.module.css';

interface BotRowProps {
  symbol: string;
  buyPrice: number;
  precoAtual: number;
  quantidade: number;
  isBought: boolean;
  onSell: () => void;
}

export const BotRow: React.FC<BotRowProps> = ({ symbol, buyPrice, precoAtual, quantidade, isBought, onSell }) => {
  const lucroPercentual = isBought ? (((precoAtual - buyPrice) / buyPrice) * 100).toFixed(2) : '-';
  const lucroValor = isBought ? ((precoAtual - buyPrice) * quantidade).toFixed(2) : '-';

  return (
    <tr>
      <td data-label="Moeda">{symbol}</td>
      <td data-label="Preço de Compra">{isBought ? `$${buyPrice.toFixed(6)}` : '-'}</td>
      <td data-label="% Ganho/Perda">
        {isBought ? (
          <span className={parseFloat(lucroPercentual) >= 0 ? styles.profitPositive : styles.profitNegative}>
            {lucroPercentual}%
          </span>
        ) : (
          '-'
        )}
      </td>
      <td data-label="Valor Ganho/Perda">
        {isBought ? (
          <span className={parseFloat(lucroValor) >= 0 ? styles.profitPositive : styles.profitNegative}>
            ${lucroValor}
          </span>
        ) : (
          '-'
        )}
      </td>
      <td data-label="Ações">
        {isBought ? (
          <button onClick={onSell} className={styles.buttonSell}>
            Vender
          </button>
        ) : (
          'Sem operação'
        )}
      </td>
    </tr>
  );
};

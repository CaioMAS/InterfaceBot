'use client';

import React from 'react';
import { BotRow } from './BotRow';
import styles from '../page.module.css';

interface Bot {
  par: string;
  url: string;
  isBought: boolean;
  buyPrice: number;
  precoAtual: number;
  quantidade: number;
}

interface BotTableProps {
  bots: Bot[];
  onSell: (url: string) => void;
}

export const BotTable: React.FC<BotTableProps> = ({ bots, onSell }) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Moeda</th>
          <th>Preço de Compra</th>
          <th>% Ganho/Perda</th>
          <th>Valor Ganho/Perda</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {bots.map((bot, idx) => (
          <BotRow
            key={idx}
            symbol={bot.par}
            buyPrice={bot.buyPrice}
            precoAtual={bot.precoAtual}
            quantidade={bot.quantidade}
            isBought={bot.isBought}
            onSell={() => onSell(bot.url)}
          />
        ))}
      </tbody>
    </table>
  );
};

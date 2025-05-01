'use client';

import { useEffect, useState, useCallback } from 'react';
import { fetchStatus } from './services/fetchStatus';
import { sellNow } from './services/sellNow';
import { BotTable } from './components/BotTable';
import styles from './page.module.css';

interface BotConfig {
  par: string;
  url: string;
}

interface BotStatus extends BotConfig {
  isBought: boolean;
  buyPrice: number;
  precoAtual: number;
  quantidade: number;
}

const botsList: BotConfig[] = [
  { par: 'DOGEUSDT', url: process.env.NEXT_PUBLIC_BOT_URL_DOGE || '' },
  { par: 'BTCUSDT', url: process.env.NEXT_PUBLIC_BOT_URL_BTC || '' },
  { par: 'WIFUSDT', url: process.env.NEXT_PUBLIC_BOT_URL_WIF || '' },
];

export default function Home() {
  const [bots, setBots] = useState<BotStatus[]>([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const [token, setToken] = useState<string>('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://82.25.92.197:3334/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: inputPassword }),
      });

      if (!response.ok) {
        throw new Error('Senha incorreta');
      }

      const data = await response.json();
      setToken(data.token);
      setAuthenticated(true);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Erro ao fazer login');
      }
    }
  };

  const updateStatuses = useCallback(async () => {
    const updated = await Promise.all(
      botsList.map(async (bot) => {
        try {
          const status = await fetchStatus(bot.url, token);
          const precoAtual = await buscarPrecoAtual(bot.par);
          return {
            par: status.symbol,
            url: bot.url,
            isBought: status.isBought,
            buyPrice: status.buyPrice,
            precoAtual: precoAtual,
            quantidade: status.tradeQuantity,
          };
        } catch (error) {
          console.error(`Erro no bot ${bot.par}`, error);
          return {
            par: bot.par,
            url: bot.url,
            isBought: false,
            buyPrice: 0,
            precoAtual: 0,
            quantidade: 0
          };
        }
      })
    );
    setBots(updated);
  }, [token]);

  const buscarPrecoAtual = async (par: string): Promise<number> => {
    try {
      const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${par}`);
      const data = await response.json();
      return parseFloat(data.price);
    } catch (error) {
      console.error(`Erro ao buscar preço de ${par}`, error);
      return 0;
    }
  };

  const handleSell = async (url: string) => {
    if (confirm('Deseja vender agora?')) {
      await sellNow(url, token);
      await updateStatuses();
    }
  };

  useEffect(() => {
    if (authenticated) {
      updateStatuses();
      const interval = setInterval(updateStatuses, 5000);
      return () => clearInterval(interval);
    }
  }, [authenticated, updateStatuses]);

  if (!authenticated) {
    return (
      <div className={styles.loginContainer}>
        <h1>🔒 Painel Protegido</h1>
        <input
          type="password"
          placeholder="Digite a senha"
          value={inputPassword}
          onChange={(e) => setInputPassword(e.target.value)}
          className={styles.loginInput}
        />
        <button onClick={handleLogin} className={styles.loginButton}>
          Entrar
        </button>
      </div>
    );
  }

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Painel de Controle de Bots</h1>
      <BotTable bots={bots} onSell={handleSell} />
    </main>
  );
}

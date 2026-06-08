import { useState } from "react";

import { useEffect } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function App() {
  const [dados, setDados] = useState({
    gasolina: 0,
    km: 0,
    outros: 0,
    faturamento: 0,
    diasSemana: 5,
    tipoCarro: "financiado",
    parcela: 0,
    aluguelSemanal: 0,
    dia: "",
  });

  const [historico, setHistorico] = useState(() => {
    const dadosSalvos = localStorage.getItem("historico");
    return dadosSalvos ? JSON.parse(dadosSalvos) : [];
  });

  useEffect(() => {
    localStorage.setItem("historico", JSON.stringify(historico));
  }, [historico]);

  const handleChange = (e) => {
    setDados({
      ...dados,
      [e.target.name]: Number(e.target.value),
    });
  };

  const calcular = () => {
    const diasMes = (dados.diasSemana * 30) / 7;

    let custoCarroDiario = 0;

    if (dados.tipoCarro === "financiado") {
      custoCarroDiario = diasMes > 0 ? dados.parcela / diasMes : 0;
    } else {
      custoCarroDiario =
        dados.diasSemana > 0 ? dados.aluguelSemanal / dados.diasSemana : 0;
    }

    const custoTotal = dados.gasolina + dados.outros + custoCarroDiario;

    const lucro = dados.faturamento - custoTotal;

    const percentual =
      dados.faturamento > 0 ? (lucro / dados.faturamento) * 100 : 0;

    return {
      custoCarroDiario,
      custoTotal,
      lucro,
      percentual,
    };
  };

  const resultado = calcular();

  const salvarDia = () => {
    if (!dados.dia) {
      alert("Selecione o dia da semana");
      return;
    }

    const novo = {
      dia: dados.dia,
      km: dados.km,
      gasto: resultado.custoTotal,
      lucro: resultado.lucro,
    };

    const novoHistorico = [...historico, novo];

    setHistorico(novoHistorico);
    localStorage.setItem("historico", JSON.stringify(novoHistorico));
  };

  const inputStyle = {
    width: "95%",
    padding: "8px",
    margin: "0 auto 8px auto",
    borderRadius: "6px",
    border: "1px solid #ccc",
    display: "block",
  };

  const totalSemana = historico.reduce((acc, item) => acc + item.lucro, 0);

  return (
    <div style={{ backgroundColor: "#000", minHeight: "100vh", padding: 20 }}>
      <div
        style={{
          maxWidth: 350,
          margin: "0 auto",
          backgroundColor: "#fff",
          padding: 16,
          borderRadius: 12,
        }}
      >
        <h1 style={{ textAlign: "center" }}>🚖 Calculadora Uber</h1>

        <select
          name="dia"
          onChange={(e) => setDados({ ...dados, dia: e.target.value })}
          style={inputStyle}
        >
          <option value="">Selecione o dia</option>
          <option>Segunda</option>
          <option>Terça</option>
          <option>Quarta</option>
          <option>Quinta</option>
          <option>Sexta</option>
          <option>Sábado</option>
          <option>Domingo</option>
        </select>

        <input
          name="faturamento"
          placeholder="Faturamento"
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          name="gasolina"
          placeholder="Gasolina"
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          name="km"
          placeholder="KM"
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          name="outros"
          placeholder="Outros custos"
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          name="diasSemana"
          placeholder="Dias semana"
          onChange={handleChange}
          style={inputStyle}
        />

        <select
          onChange={(e) => setDados({ ...dados, tipoCarro: e.target.value })}
          style={inputStyle}
        >
          <option value="financiado">Financiado</option>
          <option value="alugado">Alugado</option>
        </select>

        {dados.tipoCarro === "financiado" && (
          <input
            name="parcela"
            placeholder="Parcela"
            onChange={handleChange}
            style={inputStyle}
          />
        )}

        {dados.tipoCarro === "alugado" && (
          <input
            name="aluguelSemanal"
            placeholder="Aluguel"
            onChange={handleChange}
            style={inputStyle}
          />
        )}

        <hr />

        <h2>📊 Resultado</h2>

        <p>KM rodados: {dados.km}</p>

        <p>Custo carro por dia: R$ {resultado.custoCarroDiario.toFixed(2)}</p>

        <p>Gastos totais: R$ {resultado.custoTotal.toFixed(2)}</p>

        <p style={{ color: resultado.lucro >= 0 ? "green" : "red" }}>
          Lucro: R$ {resultado.lucro.toFixed(2)}
        </p>

        <p>Lucro por KM: R$ {(resultado.lucro / dados.km || 0).toFixed(2)}</p>

        <p>Lucro %: {resultado.percentual.toFixed(1)}%</p>

        <h3>Total da semana: R$ {totalSemana.toFixed(2)}</h3>

        <h3>📊 Gráfico de Ganhos</h3>

        <LineChart width={300} height={200} data={historico}>
          <XAxis dataKey="dia" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="lucro" stroke="#000" />
        </LineChart>

        <button
          onClick={salvarDia}
          style={{
            width: "100%",
            padding: 10,
            background: "#000",
            color: "#fff",
          }}
        >
          Salvar Dia
        </button>

        <button
          onClick={() => setHistorico([])}
          style={{
            width: "100%",
            padding: 10,
            background: "#023",
            color: "#ffa",
          }}
        >
          Limpar Histórico
        </button>

        {historico.map((item, i) => (
          <div key={i}>
            {item.dia} - R$ {item.lucro.toFixed(2)}
          </div>
        ))}
      </div>
    </div>
  );
}

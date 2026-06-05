import { useState } from "react";

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

  const [historico, setHistorico] = useState([]);

  const handleChange = (e) => {
    setDados({ ...dados, [e.target.name]: Number(e.target.value) });
  };

  const calcular = () => {
    const diasMes = (dados.diasSemana * 30) / 7;

    let custoCarroDiario = 0;

    if (dados.tipoCarro === "financiado") {
      custoCarroDiario = dados.parcela / diasMes;
    } else {
      custoCarroDiario =
        dados.dadosSemana > 0 ? dados.aluguelSemanal / dados.diasSemana : 0;
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

    setHistorico([...historico, novo]);
  };

  const inputStyle = {
    width: "95%",
    padding: "8px",
    margin: "0 auto 8px auto",
    borderRadius: "6px",
    border: "1px solid #ccc",
    display: "block",
  };

  return (
    <div
      style={{
        backgroundColor: "#000",
        minHeight: "100vh",
        padding: 20,
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          maxWidth: 350,
          margin: "0 auto",
          backgroundColor: "#fff",
          padding: 16,
          borderRadius: 12,
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: 15 }}>
          🚖 Calculadora Uber
        </h1>

        {/* DIA */}
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

        {/* INPUTS */}
        <input
          placeholder="Faturamento (R$)"
          name="faturamento"
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          placeholder="Gasolina (R$)"
          name="gasolina"
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          placeholder="KM rodados"
          name="km"
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          placeholder="Outros custos (R$)"
          name="outros"
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          placeholder="Dias na semana"
          name="diasSemana"
          onChange={handleChange}
          style={inputStyle}
        />

        {/* TIPO DE CARRO */}
        <select
          style={inputStyle}
          onChange={(e) => setDados({ ...dados, tipoCarro: e.target.value })}
        >
          <option value="financiado">Financiado</option>
          <option value="alugado">Alugado</option>
        </select>

        {/* CONDIÇÕES */}
        {dados.tipoCarro === "financiado" && (
          <input
            placeholder="Parcela mensal"
            name="parcela"
            onChange={handleChange}
            style={inputStyle}
          />
        )}

        {dados.tipoCarro === "alugado" && (
          <input
            placeholder="Aluguel semanal"
            name="aluguelSemanal"
            onChange={handleChange}
            style={inputStyle}
          />
        )}

        <hr />

        {/* RESULTADO */}
        <h2>📊 Resultado</h2>

        <p>KM: {dados.km}</p>
        <p>Gastos: R$ {resultado.custoTotal.toFixed(2)}</p>
        <p>Lucro: R$ {resultado.lucro.toFixed(2)}</p>
        <p>Lucro %: {resultado.percentual.toFixed(1)}%</p>

        {/* BOTÃO */}
        <button
          onClick={salvarDia}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "10px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#000",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Salvar Dia
        </button>

        {/* HISTÓRICO */}
        <h3 style={{ marginTop: 20 }}>📅 Histórico</h3>

        {historico.map((item, index) => (
          <div
            key={index}
            style={{
              background: "#f1f1f1",
              padding: "8px",
              borderRadius: "8px",
              marginBottom: "8px",
            }}
          >
            <strong>{item.dia}</strong>
            <br />
            KM: {item.km} | Gasto: R$ {item.gasto.toFixed(2)} | Lucro: R${" "}
            {item.lucro.toFixed(2)}
          </div>
        ))}
      </div>
    </div>
  );
}

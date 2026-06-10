import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

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

  const [semanaAtual, setSemanaAtual] = useState(() => {
    const s = localStorage.getItem("semanaAtual");
    return s ? JSON.parse(s) : [];
  });

  const [semanas, setSemanas] = useState(() => {
    const s = localStorage.getItem("semanas");
    return s ? JSON.parse(s) : [];
  });

  
const [meses, setMeses] = useState(() => {
  const m = localStorage.getItem("meses");
  return m ? JSON.parse(m) : [];
});


  const [aba, setAba] = useState("dia");

  useEffect(() => {
    localStorage.setItem("semanaAtual", JSON.stringify(semanaAtual));
    localStorage.setItem("semanas", JSON.stringify(semanas));
    localStorage.setItem("meses", JSON.stringify(meses));
  }, [semanaAtual, semanas, meses]);


 
const handleChange = (e) => {
  let valor = Number(e.target.value);

  if (e.target.name === "diasSemana") {
    if (valor > 7) valor = 7;
    if (valor < 1) valor = 1;
  }

  setDados({
    ...dados,
    [e.target.name]: valor,
  });
};


  const calcular = () => {
    const diasMes = (dados.diasSemana * 30) / 7;

    let custoCarroDiario = 0;

    if (dados.tipoCarro === "financiado") {
      custoCarroDiario = dados.parcela / (diasMes || 1);
    } else {
      custoCarroDiario =
        dados.aluguelSemanal / (dados.diasSemana || 1);
    }

    const custoTotal =
      dados.gasolina + dados.outros + custoCarroDiario;

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

  // ✅ SALVAR DIA
  const salvarDia = () => {
    if (!dados.dia) return alert("Selecione o dia");

    const novo = {
      dia: dados.dia,
      km: dados.km,
      gasto: resultado.custoTotal,
      faturamento: dados.faturamento,
      lucro: resultado.lucro,
    };

    const novaSemana = [...semanaAtual, novo];
    setSemanaAtual(novaSemana);

    if (novaSemana.length >= dados.diasSemana) {
      finalizarSemana(novaSemana);
    }
  };

  const finalizarSemana = (semana = semanaAtual) => {
    if (!semana.length) return;
  
    const novasSemanas = [...semanas, semana];
  
    setSemanas(novasSemanas);
    setSemanaAtual([]);
  
    // ✅ FECHAR MÊS AUTOMÁTICO (4 semanas)
    if (novasSemanas.length >= 4) {
      const novoMes = novasSemanas.slice(-4);
      setMeses([...meses, novoMes]);
  
      setSemanas([]); // limpa semanas depois de criar mês
    }
  };

  const limparHistorico = () => {
    if (window.confirm("Apagar tudo?")) {
      setSemanaAtual([]);
      setSemanas([]);
      setMeses([]);
      localStorage.clear();
    }
  };

  const inputStyle = {
    width: "95%",
    padding: "10px",
    marginBottom: "8px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    display: "block",
  };

  const botaoStyle = {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#000",
    color: "#fff",
    cursor: "pointer",
  };

  // ✅ CALCULOS
  const faturamentoSemana = semanaAtual.reduce((a, b) => a + b.faturamento, 0);
  const lucroSemana = semanaAtual.reduce((a, b) => a + b.lucro, 0);
  const kmSemana = semanaAtual.reduce((a, b) => a + b.km, 0);

  const semanasMes = semanas.slice(-4);

  const faturamentoMes = semanasMes.flat().reduce((a, b) => a + b.faturamento, 0);
  const lucroMes = semanasMes.flat().reduce((a, b) => a + b.lucro, 0);


  const abaStyle = (ativa) => ({
    padding: "6px 12px",
    borderRadius: "20px",
    border: "1px solid #ccc",
    cursor: "pointer",
    fontSize: "14px",
    backgroundColor: ativa ? "#000" : "#eee",
    color: ativa ? "#fff" : "#000",
    transition: "0.2s",
  });
  

  return (
    <div style={{ backgroundColor: "#000", minHeight: "100vh", padding: 20 }}>
      <div style={{
        maxWidth: 350,
        margin: "0 auto",
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12
      }}>

        <h2 style={{ textAlign: "center" }}>🚖 Calculadora Motorista 💰</h2>

        {/* ABAS */}
       
<div style={{ display: "flex", justifyContent: "space-between", marginBottom: 15 }}>
  <button style={abaStyle(aba === "dia")}   
onMouseEnter={(e) => ! (aba === "dia") && (e.target.style.background="#ddd")}
onMouseLeave={(e) => ! (aba === "dia") && (e.target.style.background="#eee")}
onClick={() => setAba("dia")}>
    Dia
  </button>

  <button style={abaStyle(aba === "semana")}
  onMouseEnter={(e) => ! (aba === "semana") && (e.target.style.background="#ddd")}
  onMouseLeave={(e) => ! (aba === "semana") && (e.target.style.background="#eee")}
  onClick={() => setAba("semana")}>
    Semana
  </button>

  <button style={abaStyle(aba === "mes")} 
  onMouseEnter={(e) => ! (aba === "mes") && (e.target.style.background="#ddd")}
  onMouseLeave={(e) => ! (aba === "mes") && (e.target.style.background="#eee")}
  onClick={() => setAba("mes")}>
    Mês
  </button>
</div>


        {/* DIA */}
        {aba === "dia" && (
          <>
            <select onChange={(e)=>setDados({...dados,dia:e.target.value})} style={inputStyle}>
              <option value="">Selecione o dia</option>
              <option>Segunda</option>
              <option>Terça</option>
              <option>Quarta</option>
              <option>Quinta</option>
              <option>Sexta</option>
              <option>Sábado</option>
              <option>Domingo</option>
            </select>

            <input name="faturamento" placeholder="Faturamento" onChange={handleChange} style={inputStyle}/>
            <input name="gasolina" placeholder="Gasolina" onChange={handleChange} style={inputStyle}/>
            <input name="km" placeholder="KM" onChange={handleChange} style={inputStyle}/>
            <input name="outros" placeholder="Outros custos" onChange={handleChange} style={inputStyle}/>
            

            <label>Dias trabalhados na semana</label>
<input
  name="diasSemana"
  type="number"
  placeholder="Ex: 5"
  min="1"
  max="7"
  onChange={handleChange}
  style={inputStyle}
/>




            <select onChange={(e)=>setDados({...dados,tipoCarro:e.target.value})} style={inputStyle}>
              <option value="financiado">Financiado</option>
              <option value="alugado">Alugado</option>
            </select>

            {dados.tipoCarro === "financiado" && (
              <input name="parcela" placeholder="Parcela" onChange={handleChange} style={inputStyle}/>
            )}

            {dados.tipoCarro === "alugado" && (
              <input name="aluguelSemanal" placeholder="Aluguel" onChange={handleChange} style={inputStyle}/>
            )}

            <h2>📊 Resultado</h2>

            <p>💰 Faturamento: R$ {dados.faturamento.toFixed(2)}</p>
            <p>📏 KM: {dados.km}</p>
            <p>🚗 Custo carro por dia: R$ {resultado.custoCarroDiario.toFixed(2)}</p>
            <p>💸 Gastos: R$ {resultado.custoTotal.toFixed(2)}</p>

            <p style={{ color: resultado.lucro >= 0 ? "green" : "red" }}>
              ✅ Lucro: R$ {resultado.lucro.toFixed(2)}
            </p>

            <p>📊 Lucro/KM: R$ {(resultado.lucro/(dados.km||1)).toFixed(2)}</p>
            <p>📈 %: {resultado.percentual.toFixed(1)}%</p>

            <button onClick={salvarDia} style={botaoStyle}>Salvar Dia</button>

            <button onClick={finalizarSemana} style={botaoStyle}>
              ✅ Fechar Semana
            </button>

            <h3>📅 Semana Atual</h3>
            {semanaAtual.map((d,i)=>(
              <div key={i}>{d.dia} | R${d.lucro.toFixed(2)}</div>
            ))}
          </>
        )}

        {/* SEMANA */}
        {aba === "semana" && (
          <>
            <h2>📊 Semana Atual</h2>

            <p>💰 Faturamento: R$ {faturamentoSemana.toFixed(2)}</p>
            <p>✅ {lucroSemana.toFixed(2)}</p>
            <p>📏 KM: {kmSemana}</p>

            <LineChart width={300} height={200} data={semanaAtual}>
              <XAxis dataKey="dia" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="lucro" stroke="#000" />
            </LineChart>

            <h3>📚 Histórico</h3>
           {semanas.map((s,i)=>(
            <div key={i}>
              Semana {i+1} | 
              💰 R$ {s.reduce((a,b)=>a+b.faturamento,0).toFixed(2)} | 
              ✅ R$ {s.reduce((a,b)=>a+b.lucro,0).toFixed(2)}
            </div>
          ))}

          </>
        )}

        {/* MES */}
        {aba === "mes" && (
          <>
            <h2>📆 Mês</h2>

            <p>💰 Faturamento: R$ {faturamentoMes.toFixed(2)}</p>
            <p>✅ Lucro: R$ {lucroMes.toFixed(2)}</p>
            <p>📅 Semanas: {semanasMes.length}</p>
          
          
          <h3>📚 Histórico Mensal</h3>
            
          {meses.map((mes,i)=>(
            <div key={i}>
              Mês {i+1} | 
              💰 R$ {mes.flat().reduce((a,b)=>a+b.faturamento,0).toFixed(2)} | 
              ✅ R$ {mes.flat().reduce((a,b)=>a+b.lucro,0).toFixed(2)}
            </div>
          ))}

          </>
          
        )}

        <button onClick={limparHistorico} style={{
          ...botaoStyle,
          background:"#c0392b"
        }}>
          🗑️ Limpar Tudo
        </button>
      </div>
    </div>
  );
}
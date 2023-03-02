import React from "react";
import {
  GET_TURMA_DIRETOR,
  GET_ANO_DIRETOR,
  POST_CREATE_TURMA,
} from "../../api/api";
import useFetch from "../../hooks/useFetch";
import Modal from "../Modal";
import style from "./DashboardTurma.module.css";
import Button from "../Form/Button";
import { Modal as ModalBootstrap } from "react-bootstrap";
import CloseButton from "react-bootstrap/CloseButton";
import Radio from "../Form/Radio";
import Form from "react-bootstrap/Form";
import Dropdown from "../Form/Dropdown";
import Alert from "react-bootstrap/Alert";

const DashboardTurma = () => {
  const { data, loading, error, request } = useFetch();
  const [turnos, setTurnos] = React.useState();
  const [ano, setAno] = React.useState();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [anoEscolar, setAnoEscolar] = React.useState(0);
  const [turnoEscolar, setTurnoEscolar] =  React.useState(0);
  const [turmaFinal, setTurmaFinal] = React.useState(0);
  const [numeroTurma, setNumeroTurma] = React.useState(0);
  const [modalMessage, setModalMessage] = React.useState("");

  React.useEffect(() => {
    async function getData() {
      const { url, options } = GET_TURMA_DIRETOR();
      const { json, response } = await request(url, options);

      if (response.ok) {
        console.log(json)
        setTurnos(json);
      }
    }

    getData();
  }, []);

  React.useEffect(() => {
    async function getData() {
      const { url, options } =  GET_ANO_DIRETOR();
      const { json, response } = await request(url, options);

      if (response.ok) {
        console.log(json)
        setAno(json);
      }
    }

    getData();
  }, []);

  React.useEffect(() => {
    if (turmaFinal == (null || undefined || "")) setTurmaFinal(0);
    if (turmaFinal >= 100) setTurmaFinal(99);
    if (anoEscolar === "Ano letivo") setAnoEscolar(0);
    setNumeroTurma(
      anoEscolar * 100 + turnoEscolar * 1000 + parseInt(turmaFinal)
    );
  }, [turnoEscolar, anoEscolar, turmaFinal]);

  function findTurma(turma, periodo, turno) {
    if (periodo == turno) return <p>{turma}</p>;
  }

  async function handleClick() {
    setModalVisible(!modalVisible);
  }

  const cadastrarTurmas = async () => {
    console.log(turnoEscolar + " " + anoEscolar + " " + turmaFinal);
    const { url, options } = POST_CREATE_TURMA({
      turnoId: parseInt(turnoEscolar),
      anoId: parseInt(anoEscolar),
      numeroFinal: parseInt(turmaFinal),
    });

    const { json, response } = await request(url, options);
    console.log(response);
    console.log(json);
    if (response.ok) setModalMessage("Turma criada com sucesso");
  };

  return (
    <div className={style.container}>
      {modalVisible && (
        <Modal>
          <ModalBootstrap.Header>
            <ModalBootstrap.Title>Cadastrar Turma</ModalBootstrap.Title>
            <CloseButton onClick={handleClick} />
          </ModalBootstrap.Header>

          {turnos && <Radio value={setTurnoEscolar} turnos={turnos} />}

          {ano && (
            <Dropdown
              name={"Ano letivo"}
              anoletivo={ano}
              setAno={setAnoEscolar}
            />
          )}

          <div>
            <input
              type="text"
              onChange={(e) => setTurmaFinal(e.target.value)}
            />
            <h5>{numeroTurma}</h5>
            {turmaFinal >= 99 && <p>numero não pode ser maior que 99</p>}
          </div>
          <div>
            <Button onClick={cadastrarTurmas} loading={loading}>
              Cadastrar
            </Button>
          </div>

          {modalMessage && (
            <Alert key="sucess" variant="sucess">
              <p>{modalMessage}</p>
            </Alert>
          )}
        </Modal>
      )}

      <div>
        <Button onClick={handleClick} loading={loading}>
          Cadastrar Turma
        </Button>
      </div>

      <div className={style.containerTurma}>
        {turnos &&
          turnos.map((turno) => (
            <div className={style.turmasInfo}>
              <h1 className={style.anoLetivo}>{turno.periodo}</h1>

              <div className={style.anos}>
                {ano &&
                  ano.map((ano) => (
                    <div>
                      <h6>{ano.anoLetivo}</h6>
                      {console.log(ano)}
                      <div className={style.turmaCod}>
                        {ano.turmas.map((turma) =>
                  
                            findTurma(
                              turma.codigo,
                              turma.turno.periodo,
                              turno.periodo
                            )
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default DashboardTurma;

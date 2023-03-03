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
import Input from "../Form/Input";

const DashboardTurma = () => {
  const { data, loading, error, request } = useFetch();
  const [turnos, setTurnos] = React.useState();
  const [ano, setAno] = React.useState();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [anoEscolar, setAnoEscolar] = React.useState(0);
  const [turnoEscolar, setTurnoEscolar] = React.useState(0);
  const [turmaFinal, setTurmaFinal] = React.useState(0);
  const [numeroTurma, setNumeroTurma] = React.useState(0);
  const [modalMessage, setModalMessage] = React.useState("");
  const [erro, setErro] = React.useState();
  const [reload, setReload] = React.useState(false);

  React.useEffect(() => {
    async function getData() {
      const { url, options } = GET_TURMA_DIRETOR();
      const { json, response } = await request(url, options);

      if (response.ok) {
        setTurnos(json);
      }
    }

    getData();
  }, [reload]);

  React.useEffect(() => {
    async function getData() {
      const { url, options } = GET_ANO_DIRETOR();
      const { json, response } = await request(url, options);

      if (response.ok) {
        setAno(json);
      }
    }

    getData();
  }, [reload]);

  React.useEffect(() => {
    if (turmaFinal == (null || undefined || "")) setTurmaFinal(0);
    if (anoEscolar === "Selecione") setAnoEscolar(0);

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
    if(anoEscolar === 0) return setErro('Ano letivo precisa ser selecionado')
    if (turmaFinal == (null || undefined || "")) return setErro('Numero final não pode ser vazio')
    const { url, options } = POST_CREATE_TURMA({
      turnoId: parseInt(turnoEscolar),
      anoId: parseInt(anoEscolar),
      numeroFinal: parseInt(turmaFinal),
    });

    const { json, response } = await request(url, options);

    if (response.ok) setModalMessage("Turma criada com sucesso");
    reloadController(response.ok)
    
  
  };
  const reloadController = (res) =>{
    setReload(!reload)
		if (res) {
			interval = setInterval(() => {
				setModalVisible(!modalVisible);
				setReload(!reload)
			}, 1000);
		}

		return () => clearInterval(interval);
  }

  
  return (
    <div className={style.container}>
      <h1 className={`${style.title} comeFromRight`}>Turmas</h1>

      {modalVisible && (
        <Modal>
          <div className={style.modal}>
            <ModalBootstrap.Header>
              <ModalBootstrap.Title>Cadastrar Turma</ModalBootstrap.Title>
              <CloseButton onClick={handleClick} />
            </ModalBootstrap.Header>

            {turnos && <Radio value={setTurnoEscolar} turnos={turnos} />}

            <div className={style.numeroTurma}>
              {ano && (
                <Dropdown
                  name={"Ano letivo"}
                  anoletivo={ano}
                  setAno={setAnoEscolar}
                />
              )}

              <Input
                label="Numero do final"
                onChange={(e) => setTurmaFinal(e.target.value)}
              />
            </div>

            <div className={style.btnNumb}>
              {numeroTurma !== 0 && <h4>{numeroTurma}</h4>}

              <Button
                onClick={cadastrarTurmas}
                disabled={turmaFinal >= 99 ? true : false}
                loading={!reload == true ? false : true}
              >
                Cadastrar
              </Button>
            </div>

            {turmaFinal >= 99 && (
              <Alert key="danger" variant="danger">
                Numero não pode ser maior que 99
              </Alert>
            )}

            {erro && (
              <Alert key="danger" variant="danger">
                {erro}
              </Alert>
            )}

            {modalMessage && (
              <Alert key="success" variant="success">
                <p>{modalMessage}</p>
              </Alert>
            )}
          </div>
        </Modal>
      )}

      <div className={`${style.listaTurmas} comeFromRight`}>
        <div className={style.divbtn}>
          <Button onClick={handleClick} loading={loading}>
            Cadastrar Turma
          </Button>
        </div>

        <div className={style.containerTurma}>
          {turnos &&
            turnos.map((turno) => (
              <div className={style.turmasInfo}>
                <h1 className={style.turnos}>{turno.periodo}</h1>

                <div className={style.anos}>
                  {ano &&
                    ano.map((ano) => (
                      <div>
                        <h6 className={style.anoletivo}>{ano.anoLetivo}</h6>

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
    </div>
  );
};

export default DashboardTurma;

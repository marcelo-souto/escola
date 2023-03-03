import Form from "react-bootstrap/Form";
import React from "react";
import style from './Dropdown.module.css'

function BasicExample({ anoletivo, setAno, name }) {
  const [anoLetivo, setAnoLetivo] = React.useState(null);

  React.useEffect(() => {
    setAno(anoLetivo);
  }, [anoLetivo]);

  return (
    <div className={style.container}>
      <Form.Label className={style.label}>{name}</Form.Label>
      <Form.Select
        value={anoLetivo}
        onChange={(e) => setAnoLetivo(e.target.value)}
        aria-label="Ano letivo"
        className={style.input}
      >
        <option>Selecione</option>
        {anoletivo &&
          anoletivo.map((ano) => (
            <option value={ano.anoId} label={ano.anoLetivo}>
              {ano.anoLetivo}
            </option>
          ))}
      </Form.Select>
    </div>
  );
}

export default BasicExample;

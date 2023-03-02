import Form from "react-bootstrap/Form";
import React from "react";

function BasicExample({ anoletivo, setAno, name }) {
  const [anoLetivo, setAnoLetivo] = React.useState(null);

  React.useEffect(() => {
    setAno(anoLetivo);
  }, [anoLetivo]);

  return (
    <>
      <h6>{name}</h6>
      <Form.Select
        value={anoLetivo}
        onChange={(e) => setAnoLetivo(e.target.value)}
        aria-label="Ano letivo"
      >
        <option>Ano letivo</option>
        {anoletivo &&
          anoletivo.map((ano) => (
            <option value={ano.anoId} label={ano.anoLetivo}>
              {ano.anoLetivo}
            </option>
          ))}
      </Form.Select>
    </>
  );
}

export default BasicExample;

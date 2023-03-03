import React from "react";
import Form from "react-bootstrap/Form";
import style from "./Radio.module.css"

const Radio = ({turnos, value}) => {
  return (
    
    <Form onChange={(e)=>value(e.target.value)}>
        <h6 className={style.label}>Turno</h6>
        <div key={`teste`} className={style.radioinput}>
          {turnos && turnos.map(turno=> <Form.Check name={'turno'} type="radio" id={turno.turnoId} value={turno.turnoId} label={turno.periodo}/> )}
          
        </div>
    </Form>

      

  );
};

export default Radio;

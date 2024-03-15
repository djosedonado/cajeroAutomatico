
import React, {useState} from 'react';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {Button, View, Text, TextInput} from 'react-native';

interface FormData {
  monto: string;
}

const App = () => {
  const { handleSubmit, setValue, watch } = useForm<FormData>();
  const [resultado, setResultado] = useState<string>('');

  const onSubmit: SubmitHandler<FormData> = data => {
    const monto = parseFloat(data.monto);
    if (!isNaN(monto)) {
      try {
        const resultadoRetiro = retirar(monto);
        console.log(resultadoRetiro);
        setResultado(resultadoRetiro);
      } catch (error) {
        console.error(error);
        setResultado('Error al retirar');
      }
    } else {
      console.error('El monto ingresado no es válido');
      setResultado('Monto inválido');
    }
  };

  const monto = watch('monto');

  function retirar(valor: number): string {
    const denominaciones: number[] = [10000, 20000, 50000, 100000];
    const billetes_a_entregar: number[] = [0, 0, 0, 0];
    let contador: number = 0;

    while (valor > 0) {
      let entra: boolean = false;
      for (let i = contador; i < denominaciones.length; i++) {
        if (valor >= denominaciones[i]) {
          billetes_a_entregar[i]++;
          valor -= denominaciones[i];
          entra = true;
        }
      }
      if (!entra && contador === denominaciones.length) {
        throw new Error(
          'El monto no se puede desglosar en billetes de las denominaciones disponibles.',
        );
      } else {
        contador++;
      }
    }

    let resultado: string = '';
    for (let i = 0; i < denominaciones.length; i++) {
      resultado += `La cantidad de billetes de $${denominaciones[i]} es de ${billetes_a_entregar[i]}\n`;
    }

    return resultado;
  }

  return (
    <View>
      <TextInput
        placeholder="Monto a retirar"
        keyboardType="numeric"
        value={monto}
        onChangeText={value => setValue('monto', value)}
      />
      <Button title="Retirar" onPress={handleSubmit(onSubmit)} />
      {resultado !== '' && <Text>{resultado}</Text>}
    </View>
  );
};

export default App;
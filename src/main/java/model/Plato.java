
package model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Plato {
    private int platoId;
    private String nombre;
    private String ingredientes;
    private String tipoPlato;
    private double precio;
    private byte[] imagen;
    private String imagenBase64;
    private boolean alPlato;
    private boolean aptoCeliaco;
    private boolean aptoVegano;
    private boolean enFalta;

    public Plato(String nombre, String ingredientes, String tipoPlato, double precio, byte[] imagen, boolean alPlato, boolean aptoCeliaco, boolean aptoVegano, boolean enFalta) {
        this.nombre = nombre;
        this.ingredientes = ingredientes;
        this.tipoPlato = tipoPlato;
        this.precio = precio;
        this.imagen = imagen;
        this.alPlato = alPlato;
        this.aptoCeliaco = aptoCeliaco;
        this.aptoVegano = aptoVegano;
        this.enFalta = enFalta;
    }

    public Plato(int platoId, String nombre, String ingredientes, String tipoPlato, double precio, byte[] imagen, boolean alPlato, boolean aptoCeliaco, boolean aptoVegano, boolean enFalta) {
        this.platoId = platoId;
        this.nombre = nombre;
        this.ingredientes = ingredientes;
        this.tipoPlato = tipoPlato;
        this.precio = precio;
        this.imagen = imagen;
        this.alPlato = alPlato;
        this.aptoCeliaco = aptoCeliaco;
        this.aptoVegano = aptoVegano;
        this.enFalta = enFalta;
    }
  

}

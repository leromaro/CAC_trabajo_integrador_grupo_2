
package data;

import static data.Conexion.*;
import java.sql.*;
import java.util.*;
import model.Plato;


public class PlatoDao {
    
    private static final String SQL_SELECT = "SELECT * FROM menu";
    private static final String SQL_SELECT_BY_NAME = "SELECT id, name, password, baja FROM users WHERE username = ?";
    private static final String SQL_INSERT = "INSERT INTO platos(nombre, ingredientes, tipoPlato, precio, imagen, alPlato, aptoCeliaco, aptoVegano, enFalta) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)";
    private static final String SQL_UPDATE = "UPDATE platos SET nombre = ?, ingredientes = ?, tipoPlato = ?, precio = ?, imagen = ?, alPlato = ?, aptoCeliaco = ?, aptoVegano = ?, enFalta = ?";
    private static final String SQL_LOGIC_DELETE = "UPDATE platos SET enFalta = ? WHERE platoId = ?";
   
    
    public List<Plato> seleccionarTodos() {
        Plato plato = null;
        List<Plato> menu = new ArrayList();

        try (Connection conn = getConexion(); // try with no necesita finally ni los close en Conexion
            PreparedStatement stmt = conn.prepareStatement(SQL_SELECT);
            ResultSet rs = stmt.executeQuery())
        {      
            while (rs.next()) {
                int platoId = rs.getInt(1);
                String nombre = rs.getString("nombre");
                String ingredientes = rs.getString("ingredientes");
                String tipoPlato = rs.getString("tipoPlato");
                double precio = rs.getDouble("precio");
                Blob blob = rs.getBlob("imagen");
                byte[] imagen = blob.getBytes(1, (int)blob.length());
                boolean alPlato = rs.getBoolean("alPlato");
                boolean aptoCeliaco = rs.getBoolean("aptoCeliaco");
                boolean aptoVegano = rs.getBoolean("aptoVegano");
                boolean enFalta = rs.getBoolean("enFalta");

                plato = new Plato(platoId, nombre, ingredientes, tipoPlato, precio, imagen, alPlato, aptoCeliaco, aptoVegano, enFalta);

                menu.add(plato);
            }
        } catch (ClassNotFoundException | SQLException ex) {
            ex.printStackTrace(System.out);
        }
        return menu;
    }
    
    public int insertar(Plato plato){
        Connection conn = null;
        PreparedStatement stmt = null;
        int registros = 0;
        try {
            conn = getConexion();
            stmt = conn.prepareStatement(SQL_INSERT);
          
            stmt.setString(1, plato.getNombre());
            stmt.setString(2, plato.getIngredientes());
            stmt.setString(3,plato.getTipoPlato());
            stmt.setDouble(4, plato.getPrecio());
            
            Blob blob = conn.createBlob();
            blob.setBytes(1,plato.getImagen());
            stmt.setBlob(5, blob);
            
            stmt.setBoolean(6,plato.isAlPlato());
            stmt.setBoolean(7, plato.isAptoCeliaco());
            stmt.setBoolean(8, plato.isAptoVegano());
            stmt.setBoolean(9,plato.isEnFalta());
            registros = stmt.executeUpdate();
        } catch (ClassNotFoundException | SQLException ex) {
            ex.printStackTrace(System.out);
        }
        finally{
            try {
                close(stmt);
                close(conn);
            } catch (SQLException ex) {
                ex.printStackTrace(System.out);
            }
        }
        return registros;
    }
       
    public int actualizar(Plato plato){
        Connection conn = null;
        PreparedStatement stmt = null;
        int registros = 0;
        try {
            conn = getConexion();
            stmt = conn.prepareStatement(SQL_UPDATE);
         stmt.setString(1, plato.getNombre());
            stmt.setString(2, plato.getIngredientes());
            stmt.setString(3,plato.getTipoPlato());
            stmt.setDouble(4, plato.getPrecio());
            Blob blob = conn.createBlob();
            blob.setBytes(1,plato.getImagen());
            stmt.setBlob(5, blob);
            
            stmt.setBoolean(6,plato.isAlPlato());
            stmt.setBoolean(7, plato.isAptoCeliaco());
            stmt.setBoolean(8, plato.isAptoVegano());
            stmt.setBoolean(9,plato.isEnFalta());
            registros = stmt.executeUpdate();
        } catch (ClassNotFoundException | SQLException ex) {
            ex.printStackTrace(System.out);
        }
        finally{
            try {
                close(stmt);
                close(conn);
            } catch (SQLException ex) {
                ex.printStackTrace(System.out);
            }
        }
        return registros;
    }
     
    public Plato seleccionarPorNombre(String nombreBuscado) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        Plato plato = null;

        try {
            conn = getConexion();
            stmt = conn.prepareStatement(SQL_SELECT_BY_NAME);
            stmt.setString(1, nombreBuscado);
            rs = stmt.executeQuery();
            
            while (rs.next()) {
                int platoId = rs.getInt(1);
                String nombre = rs.getString("nombre");
                String ingredientes = rs.getString("ingredientes");
                String tipoPlato = rs.getString("tipoPlato");
                double precio = rs.getDouble("precio");
                Blob blob = rs.getBlob("imagen");
                byte[] imagen = blob.getBytes(1, (int)blob.length());
                boolean alPlato = rs.getBoolean("alPlato");
                boolean aptoCeliaco = rs.getBoolean("aptoCeliaco");
                boolean aptoVegano = rs.getBoolean("aptoVegano");
                boolean enFalta = rs.getBoolean("enFalta");

                plato = new Plato(platoId, nombre, ingredientes, tipoPlato, precio, imagen, alPlato, aptoCeliaco, aptoVegano, enFalta);

                //usuarios.add(user);
            }
        } catch (ClassNotFoundException | SQLException ex) {
            ex.printStackTrace(System.out);
        } finally {
            try {
                close(rs);
                close(stmt);
                close(conn);
            } catch (SQLException ex) {
                ex.printStackTrace(System.out);
            }
        }

        return plato;
    }
    
     public int altaBajaLogica(Plato plato){
        Connection conn = null;
        PreparedStatement stmt = null;
        int registros = 0;
        try {
            conn = getConexion();
            stmt = conn.prepareStatement(SQL_LOGIC_DELETE);
            stmt.setBoolean(1, !plato.isEnFalta());
            stmt.setInt(2, plato.getPlatoId());
            registros = stmt.executeUpdate();
        } catch (ClassNotFoundException | SQLException ex) {
            ex.printStackTrace(System.out);
        }
        finally{
            try {
                close(stmt);
                close(conn);
            } catch (SQLException ex) {
                ex.printStackTrace(System.out);
            }
        }
        return registros;
    }
}

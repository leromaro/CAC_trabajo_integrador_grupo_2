package controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import data.PlatoDao;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.*;
import jakarta.servlet.http.*;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.logging.Logger;
import model.Plato;

@WebServlet("/menu")
@MultipartConfig(
        location = "/media/temp",
        fileSizeThreshold = 1024 * 1024,
        maxFileSize = 1024 * 1024 * 5,
        maxRequestSize = 1024 * 1024 * 10
)
public class platoServletController extends HttpServlet {

    private static final Logger LOGGER = Logger.getLogger(platoServletController.class.getName());
    //public static final String HTML_START="<html><body>";
    //public static final String HTML_END="</body></html>";

    List<Plato> menu = new ArrayList();
    ObjectMapper mapper = new ObjectMapper();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
        String route = req.getParameter("action");
        try {
            switch (route) {
                case "getAll": {
                    res.setContentType("application/json; charset= UTF-8");
                    menu = PlatoDao.seleccionarTodos();
                    byte[] imageBytes;
                    // completo el imageBase64 para mostrar al Front
                    for (Plato plato : menu) {
                        if (plato.getImagen() != null) {
                            imageBytes = plato.getImagen();
                        } else {
                            imageBytes = new byte[0];
                        }
                        String imageBase64 = Base64.getEncoder().encodeToString(imageBytes);
                        plato.setImagenBase64(imageBase64);
                    }
                    // transforma menu a Json y envía al Front
                    mapper.writeValue(res.getWriter(), menu);
                    break;
                }
                default: {
                    System.out.println("parámetro no valido");
                }
            }
            System.out.println("Operación realizada con éxito");
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Error en la operación: " + e.getMessage());
            res.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error interno del servidor");
        }

//String nombre=req.getParameter("nombre");
        //req.setAttribute("nombre", nombre.toUpperCase());
        //RequestDispatcher despachador= req.getRequestDispatcher("/menumayúsculas");
        //despachador.forward(req, res);  
        //PrintWriter out = res.getWriter();
        //Date date = new Date();
        //out.println(HTML_START + "<h2>Hola</h2><br/><h3>Date="+date +"</h3>"+HTML_END);
        //out.flush();
        //out.close();
    }

    protected void doPost(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
        try {
            req.setCharacterEncoding("UTF-8");

            String route = req.getParameter("action");

            switch (route) {
                case "add":
                    String nombre = req.getParameter("nombre");
                    String ingredientes = req.getParameter("ingredientes");
                    String tipoPlato = req.getParameter("tipoPlato");
                    double precio = Double.parseDouble(req.getParameter("precio"));

                    Part filePart = req.getPart("imagen");
                    InputStream fileContent = filePart.getInputStream();
                    byte[] imagenBytes = fileContent.readAllBytes();

                    // Obtener valores de checkboxes
                    Boolean[] checkboxValues = new Boolean[4];
                    String[] checkboxNames = {"alPlato", "aptoCeliaco", "aptoVegano", "enFalta"};

                    for (int i = 0; i < checkboxNames.length; i++) {
                        String checkboxValue = req.getParameter(checkboxNames[i]);
                        checkboxValues[i] = checkboxValue != null && checkboxValue.equals("true");
                    }
                    Plato nuevoPlato = new Plato(nombre, ingredientes, tipoPlato, precio, imagenBytes, checkboxValues[0], checkboxValues[1], checkboxValues[2], checkboxValues[3]);

                    PlatoDao.insertar(nuevoPlato);
            }

            

            res.setStatus(HttpServletResponse.SC_OK);
        } catch (Exception e) {
            LOGGER.severe("Error al procesar la solicitud: " + e.getMessage());
            e.printStackTrace();
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {

    }
}

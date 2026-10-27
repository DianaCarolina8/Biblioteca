package com.mitocode.service.impl;

import com.mitocode.model.Categoria;
import com.mitocode.repository.ICategoriaRepo;
import com.mitocode.repository.IGenericRepo;
import com.mitocode.service.ICategoriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class CategoriaServiceImpl extends CRUDImpl<Categoria, Integer> implements ICategoriaService {

    //@Autowired
    private final ICategoriaRepo repo;

    @Override
    protected IGenericRepo<Categoria, Integer> getRepo() {
        return repo;
    }

}
